FROM gitlabregistry.knf.local/tools/servue:0.1.0
ADD dist /site
ENV JSENV_PAGES_LINKER_API=http://mgmapi.knf.local/pages-linker
