const ContentComponent = {
  oninit(vnode) {
    this.requests = vnode.attrs.requests;
    this.activeTabs = {};
    this.tabs = { REQUEST: 'request', RESPONSE: 'response' };
    this.q = vnode.attrs.q;
    this.rId = vnode.attrs.rId;
    this.openedRequests = new Set();
    if (this.rId !== 'main') {
      this.openedRequests.add(this.rId);
    }
  },

  selectRequest(rId) {
    m.route.param('idx', rId);
    m.route.set(`/${rId}`);
  },

  setActiveTab(requestId, tabName) {
    this.activeTabs[requestId] = tabName;
  },

  view(vnode) {
    const q = vnode.attrs.q.toLowerCase();
    const filteredRequests = vnode
      .attrs
      .requests
      .filter(i => {
        if (q.length) {
          return i.requestId.toLowerCase().indexOf(q) !== -1
            || i.request.path.toLowerCase().indexOf(q) !== -1
            || i.method.toLowerCase().indexOf(q) !== -1
            || String(i.httpStatus).toLowerCase().indexOf(q) !== -1
            || JSON.stringify(i.response.body).toLowerCase().indexOf(q) !== -1;
        }
        return true;
      });

    return m('.container.grid-lg', filteredRequests.map(r => {
      return m('details.accordion.mb-1', { 'data-m-type': r.method, open: this.openedRequests.has(r.requestId) }, [
        m('summary.accordion-header.c-hand', { onclick: () => this.selectRequest(r.requestId) }, [
          m('.summary-title', [
            m('span.summ-method', { 'data-m-type': r.method }, `${r.response.httpStatus} ${r.method}`),
            m('span.summ-req-id.text-left.text-bold', r.requestId),
            m('span.summ-path.text-left', r.request.path),
            m('span.summ-date.text-right', r.requestedAt)
          ])
        ]),
        m('div.accordion-body', [
          m('ul.tab.tab-block', [
            m('li.tab-item', {
              class: this.activeTabs[r.requestId] === this.tabs.REQUEST ? 'active' : '',
              onclick: () => this.setActiveTab(r.requestId, this.tabs.REQUEST)
            }, [
              m('a.c-hand', 'Request')
            ]),
            m('li.tab-item', {
              class: this.activeTabs[r.requestId] === this.tabs.RESPONSE || this.activeTabs[r.requestId] === undefined ? 'active' : '',
              onclick: () => this.setActiveTab(r.requestId, 'response')
            }, [
              m('a.c-hand', 'Response')
            ])
          ]),
          // REQUEST
          m('div', { class: this.activeTabs[r.requestId] === 'request' ? '' : 'd-none' }, [
            m('h4', 'Headers'),
            m('.container', Object
              .keys(r.request.headers)
              .sort((a, b) => a.localeCompare(b))
              .map(k => m('.columns.hoverable', [
                m('.column.col-2.text-dark.text-right.text-small.text-bold', `${k}:`),
                m('.column.col-10.text-dark.text-left.text-small.text-clip', r.request.headers[k])
              ]))),
            m('h4', { class: Object.keys(r.request.query).length === 0 ? 'd-none' : '' }, 'Query'),
            m('.container', { class: Object.keys(r.request.query).length === 0 ? 'd-none' : '' }, Object
              .keys(r.request.query)
              .sort((a, b) => a.localeCompare(b))
              .map(k => m('.columns.hoverable', [
                m('.column.col-2.text-dark.text-right.text-small.text-bold', `${k}:`),
                m('.column.col-10.text-dark.text-left.text-small.text-clip', r.request.query[k])
              ]))),
            m('h4', { class: Object.keys(r.request.body).length === 0 ? 'd-none' : '' }, 'Payload'),
            m('pre.code[data-lang="JSON"]', { class: Object.keys(r.request.body).length === 0 ? 'd-none' : '' }, [
              // TODO: Check type of response : json or html
              m('code', JSON.stringify(r.request.body, null, 2))
            ])
          ]),
          // RESPONSE
          m('div', { class: this.activeTabs[r.requestId] === this.tabs.RESPONSE || this.activeTabs[r.requestId] === undefined ? '' : 'd-none' }, [
            m('h4', 'Payload'),
            m('pre.code[data-lang="JSON"]', [
              // TODO: Check type of response : json or html
              m('code', JSON.stringify(r.response.body, null, 2))
            ]),
            m('h4', 'Headers'),
            m('.container', Object
              .keys(r.response.headers)
              .sort((a, b) => a.localeCompare(b))
              .map(k => m('.columns.hoverable', [
                m('.column.col-2.text-dark.text-right.text-small.text-bold', `${k}:`),
                m('.column.col-10.text-dark.text-left.text-small.text-clip', r.response.headers[k])
              ])))
          ])
        ])
      ]);
    }));
  }
};

module.exports = ContentComponent;
