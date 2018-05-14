        function blurplify(file, callback) {
          return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = function(data) {
              resolve(Jimp.read(data.target.result));
            };
            reader.readAsDataURL(file);
          }).then((image) => {
            /* FUCK THIS SHIT */
            var darkBlurple = [78, 93, 148];
            var blurple = [114, 137, 218];
            var greyple = [153, 170, 181];
            var darkButNotBlack = [44, 47, 51];
            var notQuiteBlack = [35, 39, 42];
            var dbl = ''+document.getElementById("dbl").value;
            var bl = ''+document.getElementById("bl").value;
            var wl = ''+document.getElementById("wl").value;

            var levels = {};
            levels[dbl] = darkBlurple;
            levels[bl] = blurple;
            levels[wl] = [255, 255, 255];

            return new Promise((resolve, reject) => {
            image.grayscale()
              .scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                var red   = this.bitmap.data[ idx + 0 ];
                var green = this.bitmap.data[ idx + 1 ];
                var blue  = this.bitmap.data[ idx + 2 ];
                //var alpha = this.bitmap.data[ idx + 3 ];
                var alpha = 255;

                var keys = Object.keys(levels);
                for(var i = 0; i < keys.length; i++) {
                  if(red < keys[i]) {
                    var c = levels[keys[i]];
                    red = c[0];
                    green = c[1];
                    blue = c[2];
                    break;
                  }
                }
                this.bitmap.data[idx + 0] = red;
                this.bitmap.data[idx + 1] = green;
                this.bitmap.data[idx + 2] = blue;
                this.bitmap.data[idx + 3] = alpha;
              })
              .getBase64(Jimp.MIME_PNG, function(err, src) {
                  if (err) reject(err);
                  resolve(src);
              });
            })
          });
        }

        var upload = document.getElementById("upload");
        upload.addEventListener('change', (data) => {
          setTimeout(() => upload.value = "");
          [...data.target.files].forEach(file => {
            blurplify(file).then((src) => {
              var a = document.createElement("a");
              a.setAttribute("href", src);
              a.setAttribute("download", "blurple_" + file.name);
              document.getElementById("images").appendChild(a);

               var img = document.createElement("img");
               img.setAttribute("src", src);
               a.appendChild(img);
            }).catch(ex => {
              alert(`Couldn't blurplify ${file.name}: ${ex}.`);
            })
          });
        });
