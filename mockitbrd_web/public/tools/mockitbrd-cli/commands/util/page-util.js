var path = require('path');
var File = require('raptor/files/File');

module.exports = {
    getPageData: function(name) {

        var routeName;
        var controllerName;
        var viewName;
        var templateAndScssName;

        routeName = name;
        controllerName = getControllerName(nameb);
        viewName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + "View";

        return {

            // short name (e.g. "app/profile/account/change-password")
            routeName: routeName,

            // controller name (e.g. "accountChangePassword")
            controllerName: controllerName,

            // view  name (e.g. "AccountChangePasswordView")
            viewName: viewName,

            // name of template and scss file (e.g. "accountChangePassword")
            templateAndScssName: controllerName
        };
    },

    getModelData: function(name) {

        var globalName;
        var modelName = name;

        globalName = "MB." + name.slice(2).toLowerCase()

        return {

            // global name (e.g. "MB.passwords")
            globalName: globalName,
            // global name (e.g. "MBPasswords")
            modelName: modelName,
        };
    },

    registerThemeImport: function(outputFile, data, config, rapido) {
        var scssFileName = outputFile.getName();

        var parentFile = outputFile;
        while((parentFile = parentFile.getParentFile()) !== null) {
            var importsFile = new File(path.join(parentFile.getAbsolutePath(), 'templates/scss/all.scss'));
            if (importsFile.exists()) {
                var importsStr = importsFile.readAsString();
                if (importsStr.indexOf(scssFileName) === -1) {
                    importsStr = importsStr + '\n' + '@import "' + data.templateAndScssName + '";';

                    var relPath = path.relative(config['js.dir'].getAbsolutePath(), importsFile.getAbsolutePath());

                    importsFile.writeAsString(importsStr);

                    rapido.log.success('update', 'Added ' + templateAndScssName + ' to ' + relPath);
                }
            }
        }
    },

    registerRouteImport: function(outputFile, data, config, rapido) {
        // Register RTLD files in the app.rtld file
        var appRouterFile = config['js.file'];

        if (appRouterFile) {
            var routeXML = appRouterFile.readAsString();
            var relPathtoRoute = path.relative(process.cwd(), appRouterFile.getAbsolutePath());

            var newRouteElement = '"' + data.routeName  + '" : "' + data.controllerName + '"';
            if (routeXML.indexOf(newRouteElement) === -1) {
                routeXML = routeXML.replace(newRouteElement);
                appRouterFile.writeAsString(routeXML);
                rapido.log.success('update', 'Imported route into "' + relPathtoRoute + '"');
            }
        }
    },
    registerControllerImport: function(outputFile, config, rapido) {
        // Register RTLD files in the app.rtld file
        var controllerFile = config['js.file'];

        if (controllerFile) {
            var controllerXML = controllerFile.readAsString();
            var relControllerPath = path.relative(process.cwd(), controllerFile.getAbsolutePath());

            var newControllerElement = data.controllerName  + ': function() {\n}';
            if (controllerXML.indexOf(newTaglibElement) === -1) {
                controllerXML = controllerXML.replace(newControllerElement);
                controllerFile.writeAsString(controllerXML);
                rapido.log.success('update', 'Imported controller into "' + relControllerPath + '"');
            }
        }
    },

    getControllerName: function(name) {
        name = name.split("/");
        var length = name.length;

        if (length > 1) {
            var place1 = length - 2;
            var place2 = length - 1;
            var cName = name[place1] + name[place2].charAt(0).toUpperCase() + name[place2].slice(1)
            return cName.replace(/-/g, "");;
        } else {
            return name[0];
        }
    }
};






