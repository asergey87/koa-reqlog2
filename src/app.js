const ContentComponent = require('./components/content');
const NavbarComponent = require('./components/navbar');

class RootComponent {
  constructor() {
    this.q = '';
    this.requests = [];
    this.getRequests();
  }

  getRequests() {
    m
      .request({
        method: 'GET',
        url: `${window.api_url}?json=1`
      })
      .then(result => {
        // eslint-disable-next-line no-console
        this.requests = result.requests;
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log('Couldn\'t get api response from server. Message from server:', e.message);
      });
  }

  search(value) {
    this.q = value;
  }

  view(vnode) {
    return [
      m(NavbarComponent, { onSearch: this.search.bind(this) }),
      m(ContentComponent, { requests: vnode.state.requests, q: this.q, rId: vnode.attrs.idx })
    ];
  }
}

m.route(document.getElementById('app'), '/main', {
  '/:idx': RootComponent
});
