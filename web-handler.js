/* global frameRate, quarantinePolicy */

let masksBtn = $("#masksBtn");
let sdBtn = $("#sdBtn");
let qtBtn = $("#qtBtn");

let slider = $("#slider");
let sliderp = $("#sliderp");
let masksValue = $("#masksValue");

sliderp.hide();
$(function() {
  slider.slider();
});

let sliderValue = 0;

slider.on("slide", updateMaskSlider);

function updateMaskSlider(event, ui) {
  if (masksBtn.html() === "Masks: ON") {
    sliderValue = ui.value;
  } else {
    sliderValue = 0;
  }
  masksValue.html(""+sliderValue);
}

masksBtn.click(function() {
  if (masksBtn.html() === "Masks: OFF") {
    masksBtn.html("Masks: ON");
    sliderp.slideDown();
    sliderValue = slider.slider("value");
  } else {
    masksBtn.html("Masks: OFF");
    sliderp.slideUp();
    sliderValue = 0;
  }
  masksValue.html(""+sliderValue);
});

sdBtn.click(function() {
  if (sdBtn.html() === "Social Distancing: OFF") {
    sdBtn.html("Social Distancing: ON");
    frameRate(20);
  } else {
    sdBtn.html("Social Distancing: OFF");
    frameRate(60);
  }
});

qtBtn.click(function() {
  if (qtBtn.html() === "Quarantining: OFF") {
    qtBtn.html("Quarantining: ON");
    quarantinePolicy = true;
  } else {
    qtBtn.html("Quarantining: OFF");
    quarantinePolicy = false;
  }
});