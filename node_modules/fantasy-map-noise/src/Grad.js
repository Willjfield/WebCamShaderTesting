function Grad(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
Grad.prototype.dot2 = function(x, y) {
    return this.x * x + this.y * y;
};

Grad.prototype.dot3 = function(x, y, z) {
    return this.x * x + this.y * y + this.z * z;
};

export default Grad;
