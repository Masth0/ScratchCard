<template>
    <div>
        <div class="sc__wrapper">
            <!-- scratchcard -->
            <div id="js--sc--container" class="sc__container">
                <!-- background image insert here by scratchcard-js -->
                <!-- canvas generate here -->
            </div>
            <!-- infos -->
            <div class="sc__infos">
                <p>0%</p>
            </div>
        </div>
        <br><br>
    </div>
</template>

<style lang="scss">
    .sc__inner {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .sc__wrapper {
        display: block;
        width: 100%;
        height: 300px;
        max-width: 300px;
        margin: 0 auto;
        border: 5px solid white;
    }

    .sc__container {
        position: relative;
        overflow: hidden;
        height: 300px;
        max-width: 300px;
    }

    .sc__container > img {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
    }

    .sc__container canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
    }

    .sc__infos {
        text-align: center;
        height: 40px;
        line-height: 40px;
        margin-top: 5px;
        font-weight: bold;
        font-size: 18px;
    }
</style>

<script>
    export default {
      mounted() {
        import('../../../build/scratchcard.min').then(() => {
          const scContainer = document.getElementById('js--sc--container')
          const scInfos = document.querySelector('.sc__infos');
          const sc = new ScratchCard('#js--sc--container', {
            scratchType: SCRATCH_TYPE.BRUSH,
            containerWidth: scContainer.offsetWidth,
            containerHeight: 300,
            brushSrc: '../images/brush.png',
            imageForwardSrc: '../images/scratchcard.jpg',
            imageBackgroundSrc: '../images/result.png',
            htmlBackground: '',
            clearZoneRadius: 0,
            nPoints: 30,
            pointSize: 4,
            callback: function () {
              alert('Now the window will reload !')
              window.location.reload()
            }
          })

          // Init
          sc.init().then(() => {
            sc.canvas.addEventListener('scratch.move', () => {
              let percent = sc.getPercent().toFixed(0);
              scInfos.innerHTML = percent + '%';
            })
          }).catch((error) => {
            // image not loaded
            alert(error.message);
          });
        })
      }
    }
</script>
