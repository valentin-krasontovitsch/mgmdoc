FROM gitlabregistry.knf.local/tools/servue:0.1.0
ADD dist /site
ENV JSENV_API_HOST=http://mgmapi.knf.local/labdashbackend
