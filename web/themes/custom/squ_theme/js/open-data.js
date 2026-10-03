(function (Drupal, once) {
  Drupal.behaviors.squOpenData = {
    attach(context) {
      once('od-active-tab', '.open-data-sidebar a', context).forEach((link) => {
        const here = window.location.pathname.replace(/\/$/, '');
        const target = link.pathname.replace(/\/$/, '');
        if (here === target) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }
      });
      once('od-first-open', '.view-open-data-items details.od-item', context).forEach((item, index) => {
        if (index === 0) {
          item.open = true;
        }
      });
    },
  };
})(Drupal, once);