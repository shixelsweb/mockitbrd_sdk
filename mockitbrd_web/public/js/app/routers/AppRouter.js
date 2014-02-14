define(['backbone', 'marionette'], function(Backbone, Marionette) {
   return Backbone.Marionette.AppRouter.extend({
       //"index" must be a method in AppRouter's controller
       appRoutes: {
          //Main App Routes
           "": "index",
           "login": "login",
           "register": "register",
           //Top Level Navigation routes
           "learnmore": "services",
           "team": "team",
           "contact": "contact",
           //Team Member Routes
           "team/earl": "earl",
           "team/fara": "fara",
           "team/clee": "clee",
           //Learn More Routes
           "learnmore/education": "educationLearnMore",
           "learnmore/candidates": "candidateLearnMore",
           "learnmore/professionals": "professionalLearnMore",
           //Pricing Routes
           "pricing/education": "educationPricing",
           "pricing/enterprise": "enterprisePricing",
           "pricing/candidates": "candidatePricing",
           "pricing/professionals": "professionalPricing",
           //Application Pages
           "dashboard": "dashboard",
           "user/:id": "user",
           "tasks": "tasks",
           "register?referrel_code=:id": "register",
           "user/:id/account/general": "account",
           "user/:id/account/security": "accountSecurity",
           "user/:id/account/social": "accountSocial",
           "user/:id/account/billing": "accountBilling",
           "user/:id/account/support": "accountSupport",
           "user/:id/account/notifications": "accountNotifications",
           "interview/:id": "interview",
           "share": "share",
           "explore": "explore",
           "user/interview/create": "createInterview",
           //404 error route
           "*notFound": "notFound"
       }
   });
});