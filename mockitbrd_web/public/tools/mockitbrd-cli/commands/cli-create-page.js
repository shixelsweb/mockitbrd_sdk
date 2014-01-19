var File = require('raptor/files/File');
var pageUtil = require('./util/page-util.js');
var SUFFIX = 'Page';

module.exports = {
    usage: 'Usage: $0 create page <page-name>',

    options: {

        'overwrite': {
            'boolean': true,
            describe: 'Overwrite existing files'
        }
    },

    validate: function(args, rapido) {
        args.name = args._[0];
        if (!args.name) {
            throw 'Component name is required';
        }

        return args;
    },

    run: function(args, config, rapido) {
        var scaffoldDir = config['scaffold.page.dir'];

        if (!scaffoldDir) {
            throw new Error('"scaffold.page.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        // name should be something like "app/user/account/change-password"
        var data = pageUtil.getPageData(args['name']);
        var directory = "templates/"
        data.args = args;

        var baseDir = config['js.dir'] || process.cwd();

        var outputDir = new File(baseDir, directory);

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                overwrite: args['overwrite'],
                data: data,
                afterFile: function(outputFile) {
                    var extension = outputFile.getExtension();
                    if (extension === 'scss') {
                        pageUtil.registerThemeImport(outputFile, data, config, rapido);
                    }
                    if (extension === 'js') {
                        pageUtil.registerRouteImport(outputFile, data, config, rapido);
                        pageUtil.registerControllerImport(outputFile, data, config, rapido);
                    }
                }
            });

        rapido.log.success('finished', 'Widget written to "' + rapido.relativePath(outputDir) + '"');
    }
};