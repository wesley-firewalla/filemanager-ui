'use strict';

App.directive('toggleState', function(toggleStateService) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var $body = $('body');

            $(element).on('click', function(e) {
                e.preventDefault();
                var classname = attrs.toggleState;

                if (classname) {
                    if ($body.hasClass(classname)) {
                        $body.removeClass(classname);
                        if (!attrs.noPersist)
                            toggleStateService.removeState(classname);
                    } else {
                        $body.addClass(classname);
                        if (!attrs.noPersist)
                            toggleStateService.addState(classname);
                    }

                }

            });
        }
    };

});
