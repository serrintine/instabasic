var ModalEffects = (function() {

    function init() {
        var overlay = document.querySelector('.md-overlay');

        [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function(el, i) {
            var modal = document.querySelector('#' + el.getAttribute('data-modal')),
                close = modal.querySelector('.md-close');

            function removeModal() {
                classie.remove(modal, 'md-show');
            }

            el.addEventListener('click', function(ev) {
                classie.add(modal, 'md-show');
                overlay.removeEventListener('click', removeModal);
                overlay.addEventListener('click', removeModal);
            });

            close.addEventListener('click', function(ev) {
                ev.stopPropagation();
                removeModal();
            });
        });
    }

    init();

})();
