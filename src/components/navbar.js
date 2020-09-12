const NavbarComponent = {
  oninit(vnode) {
    this.emitSearch = vnode.attrs.onSearch;
  },
  filter(e) {
    this.emitSearch(e.target.value);
  },

  onClick() {
    m.route.set('/');
    window.location.reload();
  },

  view() {
    return m('.container.grid-lg', [
      m('header.navbar', [
        m('section.navbar-section.c-hand', { onclick: () => this.onClick() }, [
          m('a.a.navbar-brand.mr-2', 'Request Logger')
        ]),
        m('section.navbar-section', [
          m('div.input-group.input-inline', [
            m('input.form-input[type=text][placeholder=search]', { onkeyup: e => this.filter(e) })
          ])
        ])
      ])
    ]);
  }
};

module.exports = NavbarComponent;
