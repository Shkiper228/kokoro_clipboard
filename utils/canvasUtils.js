function fillRectRadius(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x, y + radius);
    context.arcTo(x, y + height, x + radius, y + height, radius);
    context.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    context.arcTo(x + width, y, x + width - radius, y, radius);
    context.arcTo(x, y, x, y + radius, radius);
    context.fill();
}

module.exports.fillRectRadius = fillRectRadius;


// function fillRectRadius(context, x, y, width, height, radius) {
//     context.fillRect(x, y + radius, width, height - 2 * radius);
//     context.fillRect(x + radius, y, width - 2 * radius, height);
//     context.beginPath();
//     context.moveTo(x, y + radius);
//     context.arcTo(x, y + height, x + radius, y + height, radius);
//     context.arcTo(x + width, y + height, x + width, y + height - radius, radius);
//     context.arcTo(x + width, y, x + width - radius, y, radius);
//     context.arcTo(x, y, x, y + radius, radius);
//     context.stroke();
// }

// module.exports.fillRectRadius = fillRectRadius;