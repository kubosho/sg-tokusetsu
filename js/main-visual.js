(function (exports) {
    'use strict';

    function TransparentImages(imgsLength) {
        this.imgsLength = imgsLength;
    }

    TransparentImages.prototype.createTranslateImage = function (baseImage, maskImagePath, appendTarget, index, onLoad)  {
        var that = this;
        var i = index || -1;
        var image = document.createElement('img'),
            maskImage = document.createElement('img');
        var count = 0;
        var imgsLength = that.imgsLength;

        baseImage.style.display = 'none';

        function fireAfterImgLoad() {
            if (++count < imgsLength - 1) {
                return;
            }
            var loadResultElement = onLoad.bind(that, image, maskImage, (i + 1));
            appendTarget.appendChild(loadResultElement());

            if (--that.imgsLength === 0) {
                document.body.className = 'main-image-load-complete';
            }
        }

        image.onload = fireAfterImgLoad;
        maskImage.onload = fireAfterImgLoad;

        image.src = baseImage.src;
        maskImage.src = maskImagePath;
    };

    TransparentImages.prototype.translateCanvas = function (targetImage, maskImage, index) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            i = index || -1;

        canvas.width = targetImage.naturalWidth;
        canvas.height = targetImage.naturalHeight;
        i !== -1 ? canvas.className = 'main-visual-0' + index : '';

        ctx.drawImage(targetImage, 0, 0);
        ctx.globalCompositeOperation = 'xor';
        ctx.drawImage(maskImage, 0, 0);

        return canvas;
    };

    exports.TransparentImages = TransparentImages;
})(window);

document.addEventListener('DOMContentLoaded', function () {
    var appendTarget = document.querySelector('.main-visual'),
        suffix = '-mask';
    var imgs = appendTarget.getElementsByTagName('img');
    var transparentImages = new TransparentImages(imgs.length);

    [].forEach.call(imgs, function (img, index) {
        var maskImage = img.src.replace(/\.jpg$/, suffix + '.png');

        transparentImages.createTranslateImage(
            img,
            maskImage,
            appendTarget,
            index,
            transparentImages.translateCanvas
        );
    });

});
