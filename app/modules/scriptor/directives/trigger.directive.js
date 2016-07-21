/**
 * Created by Shipra
 */
"use strict";

angular.module('automationApp.scriptor')
    .directive('triggerItem', ['$timeout', 'scriptorService', function($timeout, scriptorService) {

        return {
            restrict: 'A',
            templateUrl: 'modules/scriptor/directives/trigger.tpl.html',
            scope: {
                'method' : '=',
                'action': '=',
                'index' : '=',
                'close' : '='
            },
            link: function (scope, element, attributes) {

                // Toggle Panel Content
                scope.oldAction = angular.copy(scope.action);

                element.on('click',".panel-header",function (event) {
                    event.preventDefault();

                    if($(this).find('.panel-toggle.closed').length == 0) {
                        var activeElement = $(this).closest('.data-items').find('.panel-toggle.closed');
                        if(activeElement.length != 0) {
                            activeElement.toggleClass("closed").parents(".panel:first").find(".panel-content").slideToggle();
                        }
                    }

                    $(this).find(".panel-toggle").toggleClass("closed");
                    $(this).siblings(".panel-content").slideToggle();
                    event.stopPropagation();
                });


                //Save button clicked
                element.on('click',".trigger-save",function (event) {
                    event.preventDefault();

                    //todo
                    scope.oldAction = angular.copy(scope.action);

                    element.find(".panel-toggle").toggleClass("closed");
                    element.find(".panel-content").slideToggle();
                    event.stopPropagation();
                });

                //cancel button clicked
                element.on('click',".trigger-cancel",function (event) {
                    event.preventDefault();

                    //todo
                    scope.action = angular.copy(scope.oldAction);
                    scope.$apply();

                    element.find(".panel-toggle").toggleClass("closed");
                    element.find(".panel-content").slideToggle();

                    setAutoComplete();

                    event.stopPropagation();
                });


                if(scope.close) {
                    element.find(".panel-content").slideToggle();
                }
                else {
                    element.find(".panel-toggle").addClass("closed");
                }


                element.on('click',".panel-header .panel-close",function (event) {
                    event.preventDefault();
                    var $item = $(this).parents(".dd-item:first");
                    bootbox.confirm("Are you sure to remove this trigger?", function (result) {
                        if (result === true) {
                            $item.addClass("animated bounceOutRight");
                            window.setTimeout(function () {
                                $item.remove();
                            }, 300);
                        }
                    });
                    event.stopPropagation();
                });

                element.on('click',".panel-move",function (event) {
                    event.preventDefault();
                    //todo
                    event.stopPropagation();
                });

/*                element.on('click',".panel-copy",function (event) {
                    event.preventDefault();
                    //todo
                    event.stopPropagation();
                });*/

                element.on('click',".copy-trigger",function (event) {
                    event.preventDefault();
                    var triggerNumber = parseInt($(this).closest('.li-level-2').data('id'));
                    var triggerToCopy = angular.copy(scope.method.actions[triggerNumber]);

                    scope.method.actions.splice(triggerNumber, 0, triggerToCopy);
                    scope.$apply();
                    event.stopPropagation();
                });

                // if suggestions needs to be shown

                var isElementName = scope.action.syntax.toLowerCase().indexOf("elementname") >= 0;
                var isKeyName = scope.action.syntax.toLowerCase().indexOf("keyname") >= 0;
                var suggestions;
                if(isElementName) {
                    suggestions = scriptorService.getElementNameSuggestions();
                }
                else if(isKeyName) {
                    suggestions = scriptorService.getKeyNameSuggestions();
                }



                var setXPathValue = function() {
                    if(isElementName) {
                        var val = element.find( ".input__field:first").val();

                        if(val) {
                            var xPath = scriptorService.getXPathForElement(val);
                            if(xPath) {
                                element.find( ".input--hoshi:first .xpath-text" ).html(xPath);
                            }
                            else {
                                element.find( ".input--hoshi:first .xpath-text" ).html("");
                            }
                        }
                    }
                };


                var setAutoComplete =  function() {
                    setXPathValue();
                    element.find( ".input__field:first" ).autocomplete({
                        source: suggestions,
                        select: function( event, ui ) {
                            scope.action.values[0].actVal = ui.item.value;

                            if(isElementName) {
                                var xPath = scriptorService.getXPathForElement(ui.item.value);
                                if(xPath) {
                                    $(this).siblings('.xpath-text').html(xPath);
                                }
                            }

                            scope.$apply();

                            return true;
                        }
                    });
                }

                if(isElementName || isKeyName)
                {
                    $timeout(function(){
                        setAutoComplete();
                    },200);
                }


                element.find( ".input__field:first" ).live( "blur", function( event ) {
                    setXPathValue();
                });

            }
        }
    }]);

