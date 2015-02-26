//problem: Type something in the textarea which will appear in the canvas.
//solution:
var my_canvas = document.getElementById("myCanvas");



$(".container").on("keyup","#intake", function(){
    var my_input = $(this).val();
    console.log(my_input);
    var ctx = my_canvas.getContext("2d");
    ctx.font = "48px serif";
    ctx.fillText(my_input,100,150);
});


