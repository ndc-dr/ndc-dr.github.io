docker run --rm -v "$PWD":/data -w /data \
  ubuntu:24.04 bash -c \
  "apt-get update -qq && apt-get install -y -qq libvips-tools && \
   vips dzsave 'SLD Full Phase.png' sld \
     --tile-size=512 --overlap=1 --suffix='.jpg[Q=82]'"