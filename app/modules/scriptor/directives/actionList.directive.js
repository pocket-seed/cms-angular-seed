/**
 * Created by Shipra
 */
"use strict";

angular.module('automationApp.scriptor')
    .directive('actionList', function() {
        return {
            restrict: 'A',
            templateUrl: 'modules/scriptor/directives/views/actionList.tpl.html',
            scope: {
                'triggers': '='
            },
            link: function(scope, element, attributes){
                scope.searchActionText = "";

                scope.$on('ACTION_SEARCH_RESET', function(event) {
                    scope.searchActionText = "";
                });
            }
        }
    });

