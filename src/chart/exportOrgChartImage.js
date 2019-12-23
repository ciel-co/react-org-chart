const d3 = require('d3')

module.exports = exportOrgChartImage

function exportOrgChartImage(config, nodeLeftX, nodeRightX, nodeY) {
  var w = nodeLeftX + nodeRightX
  var h = nodeY
  var ratio = 2

  const { id, downlowdedOrgChart } = config
  // checking wether it has canvas in the convas-container div
  document.getElementById(`${id}-canvas-container`).querySelector('canvas')
    ? document
        .getElementById(`${id}-canvas-container`)
        .querySelector('canvas')
        .remove()
    : ''

  // creating a canvas element
  var canvas1 = document.createElement('canvas')
  canvas1.id = 'canvas1'
  canvas1.width = w * ratio
  canvas1.height = h * ratio
  document.getElementById(`${id}-canvas-container`).appendChild(canvas1)

  // creating duplicate org chart svg from original org chart svg
  var step = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  step.id = 'newsvg'
  step.setAttribute('width', w)
  step.setAttribute('height', h)
  step.setAttribute('viewBox', `${-nodeLeftX} 0 ${w} ${h + 200}`)
  step.innerHTML = $('#svg').html()

  document.getElementById('#react-org-chart-svg-container').querySelector('svg')
    ? document
        .getElementById('#react-org-chart-svg-container')
        .querySelector('svg')
        .remove()
    : ''
  document.getElementById('#react-org-chart-svg-container').appendChild(step)

  // appending g element from svg
  const g = document
    .getElementById('#react-org-chart-svg-container')
    .querySelector('g')
  g.setAttribute('transform', `translate(0,0)`)
  var html = new XMLSerializer().serializeToString(
    document
      .getElementById('#react-org-chart-svg-container')
      .querySelector('svg')
  )

  // generating image with base 64
  var imgSrc = 'data:image/svg+xml;base64,' + btoa(html)
  let canvas = document.getElementById('canvas1')
  let context = canvas.getContext('2d')
  let image = new Image()
  image.src = imgSrc

  // downloading the image
  image.onload = function() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    let canvasData = canvas.toDataURL('image/png')
    let a = document.createElement('a')
    a.download = 'orgchart.png'
    a.href = canvasData
    a.click()
    downlowdedOrgChart(true)
  }
}