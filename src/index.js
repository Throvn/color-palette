import * as Vibrant from 'node-vibrant'
import './codicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import "./index.css"
import '@simonwep/pickr/dist/themes/classic.min.css'
import Pickr from '@simonwep/pickr';

let sample = 'https://picsum.photos/600/400'

let pickr;

function init(imgLink) {
    document.getElementById("mainImage").src = imgLink

    Vibrant.from(imgLink).getPalette().then(renderColors).catch(e => {
        console.error(e.message)
        if (e.message !== "t.el is null") {
            document.getElementById("error-msg").textContent = e.message.replace("Fail", "Failed")
            document.getElementById("error-container").style.display = "block"
        } else {
            document.getElementById("error-container").style.display = "none"
        }
    })
}

const loadNewImage = function (event) {
    if (event.keyCode === 13) {
        console.log(event.srcElement.value)
        init(event.srcElement.value)
        
    }
}

$(function () {
    document.getElementById("mainImage").src = sample

    $('[data-toggle="tooltip"]').tooltip()
    $('#settings').popover({
        title: "Settings",
        content: document.getElementById("popover-content").innerHTML,
        sanitize: false,
        html: true,
        placement: 'bottom',
        container: 'body'
    }, () => {console.log(document.getElementById("customImage"))})

    document.getElementById("popover-content").remove()

    $('#settings').on('shown.bs.popover', () => {
        document.getElementById("customImage").addEventListener("keydown", event => loadNewImage(event))
    })

    init(sample)
})

const renderColors = palette => {
    const $colors = document.getElementById('colors')
    const settings = $colors.firstElementChild
    $colors.innerHTML = ""
    console.log(settings)
    $colors.appendChild(settings)

    const paletteNames = Object.keys(palette)
    const paletteValues = Object.values(palette)

    for (let i = 0; i < paletteNames.length; i++) {
        const name = paletteNames[i], value = paletteValues[i];
        const colorEl = document.createElement('span');
        colorEl.className = "color-preview rounded m-2";
        colorEl.style.backgroundColor = `rgb(${value._rgb.join(',')})`
        colorEl.title = name.replace(/([a-z])([A-Z])/g, "$1 $2")
        colorEl.addEventListener("click", copyToClipboard)
        $(colorEl).tooltip()
        $colors.appendChild(colorEl)
    }

    pickr = renderPickr(`rgb(${paletteValues[0]._rgb.join(',')})`)
}

function copyToClipboard(event) {
    const element = event.srcElement
    console.log(element.style.backgroundColor)
    navigator.clipboard.writeText(element.style.backgroundColor).catch(e => console.error(e))
    console.log(element)
    document.getElementById("activeColor").textContent = element.dataset.originalTitle
    pickr.setColor(element.style.backgroundColor)

}

const renderPickr = (defaultColor) => {
    return Pickr.create({
        el: '.color-picker',
        theme: 'classic',
        useAsButton: true,
        inline: true,

        default: defaultColor,
    
        components: {
    
            // Main components
            preview: true,
            opacity: true,
            hue: true,
    
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true
            }
        },
        defaultRepresentation: 'HEX',
        showAlways: true
    });
}