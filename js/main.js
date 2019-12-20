$(document).ready(function(){
 $('.header').height($(window).height());
});

$('.carousel').carousel({
    interval: 6000
});

$(".navbar a").click(function(){
  $("body,html").animate({
   scrollTop:$("#" + $(this).data('value')).offset().top
  },1000)
  
 });
$(".description a").click(function(){
  $("body,html").animate({
   scrollTop:$("#" + $(this).data('value')).offset().top
  },1000)
  
 });