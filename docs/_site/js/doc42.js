var contents = gajus.contents({
  contents: document.querySelector('#contents > div'),
  articles: document.querySelectorAll(
   'h1:not([data-ignore-toc]), \
    h2:not([data-ignore-toc]), \
    h3:not([data-ignore-toc]), \
    h4:not([data-ignore-toc]), \
    h5:not([data-ignore-toc]), \
    h6:not([data-ignore-toc])'
  )
});
