(function (exports) {
    'use strict';

    function CreateTransparentImages(targetTransparentImagePaths, maskImagesSuffix) {
        var that = this;
        var suffix = maskImagesSuffix || 'mask';

        targetTransparentImagePaths.forEach(function (imagePath, i) {
            var maskImagePath = imagePath.replace(/\.jpg/, '-' + suffix + '.png');
            that.onLoadImage(imagePath, maskImagePath);
        });
    }

    CreateTransparentImages.prototype.onLoadImage = function (targetImageName, maskImageName) {
        var targetImage = document.createElement('img');
        targetImage.src = targetImageName;

        var maskImage = document.createElement('img');
        maskImage.src = maskImageName;

        targetImage.onload = function () { this.translateImage(targetImage, maskImage) };
        maskImage.onload = function () { this.translateImage(targetImage, maskImage) };
    };

    CreateTransparentImages.prototype.translateImage = function (targetImage, maskImage) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = targetImage.naturalWidth;
        canvas.height = targetImage.naturalHeight;

        ctx.drawImage(targetImage, 0, 0);
        ctx.globalCompositeOperation = 'xor';
        ctx.drawImage(maskImage, 0, 0);

        return canvas;
    };

    CreateTransparentImages.prototype.appendCanvas = function (targetElement, canvas) {
        document.querySelector(targetElement).querySelector(canvas);
    };

    exports.CreateTransparentImages = CreateTransparentImages;
})(window);

document.addEventListener('DOMContentLoaded', function () {
    var images = ['//cdn.rawgit.com/o2project/sg-tokusetsu/master/img/okabe.jpg', '//cdn.rawgit.com/o2project/sg-tokusetsu/master/img/kurisu.jpg', '//cdn.rawgit.com/o2project/sg-tokusetsu/master/img/kokuban.jpg'];
    var transparentImages = new CreateTransparentImages(images);
});
