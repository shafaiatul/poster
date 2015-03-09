//problem: Type something in the textarea which will appear in the canvas.
//==========================================================================

// function to clear the canvas
//cnv = object with the canvas eleent
function clearCanvas(cnv){
  var ctx = cnv.getContext("2d"); //gets reference to the canvas context
  ctx.beginPath(); //clear existing drawing path
  ctx.save(); // store the current transformation matrix

  //use the identity matrix while clearing the canvas
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,cnv.width,cnv.height); //to clear a rectangle (erase that area to transparent black)
  ctx.restore(); //redevelop the transform
}

//Adding text in canvas on multiple lines
//ctx = reference to canvas context
//text = the text to add
//x = horizontal position where to start adding the text
//y = vertical position where to start adding the text
//maxWidth = the maximum width of the text line
//lineHeight = the height of the line
function addTextCnv(ctx, text, x, y, maxWidth, lineHeight){
  //split the text in words
  var words = text.split(" ");
  var nr_w = words.length
  var addtxt = " ";

  //set: adding the text and rows
  for(var n = 0; n < nr_w; n++){
    var txtLine = addtxt +words[n]+ " ";
    var metrics = ctx.measureText(txtLine); //takes a string as an argument and returns a metric
    var txtWidth = metrics.width; // width in pixel of the needed boundary
      if (txtWidth > maxWidth && n > 0){
        ctx.fillText(addtxt, x, y);
        addtxt = words[n] + " ";
        y += lineHeight;
      }
      else addtxt = txtLine;
    }

      //adding the text in canvas(set the text color, font type, size)


      ctx.fillStyle = "";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText(addtxt, x, y);
}



//get a reference to the canvas element and its context
var cnv1 = document.getElementById("cnv1");
var ctx1 = cnv1.getContext("2d");

//setting maximum line width, line height and x / y cordinates for text
var maxWidth = cnv1.width - 10;
var lineHeight = 23;

var x_pos = (cnv1.width - maxWidth) / 2;
var y_pos = 15;

$('#text_cnv').on("keyup",function() {
  clearCanvas(cnv1);      // clears the canvas
  addTextCnv(ctx1, this.value, x_pos, y_pos, maxWidth, lineHeight);
});


var colorPick = $("#custom").spectrum({
  color: ""
});





