// Implementation of Perlin noise alg from Ken Perlin's
// "Improved Noise reference implementation"
// https://cs.nyu.edu/~perlin/noise/
// Optimizations and inspiration
// https://github.com/josephg/noisejs

// Fade function
function fade(t: number): number{
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// Linear interpolation
function lerp(a: number, b: number, t: number): number{
    return (1-t)*a + t*b;
}

// Gradient function and dot product
class grad {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
}

var grad3 = [new grad(1, 1, 0), new grad(-1, 1, 0), new grad(1, -1, 0), new grad(-1, -1, 0),
    new grad(1, 0, 1), new grad(-1, 0, 1), new grad(1, 0, -1), new grad(-1, 0, -1),
    new grad(0, 1, 1), new grad(0, -1, 1), new grad(0, 1, -1), new grad(0, -1, -1)];


// Permutation table
var p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

var perm = new Array(512);
var gradP:grad[] = new Array(512);

// Randomize permutation table
var seed = Math.random() * 1000000;

for (let i = 0; i < 256; i++) {
    var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
}

// Perlin noise function
export function noise(x: number, y: number, z:number): number{

    const resolution = 256;
    // Find the unit cube that contains the point
    let cube: [number, number, number];
    cube = [Math.floor(x) & (resolution - 1), Math.floor(y) & (resolution - 1), Math.floor(z) & (resolution - 1)];
    
    // Find relative x, y, z of point in cube
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    // Compute fade curves for each of x, y, z
    let fade_curves: [number, number, number];
    fade_curves = [fade(x), fade(y), fade(z)];


    // Create hash table of cube corners
    // Probably bad idea to use tuple because of poor readability
    let hash_table: [number, number, number, number, number, number, number, number];

    hash_table = [0, 0, 0, 0, 0, 0, 0, 0];

    hash_table[0] = gradP[cube[0]+  perm[cube[1]+  perm[cube[2]  ]]].dot(x,   y,     z);
    hash_table[1] = gradP[cube[0]+  perm[cube[1]+  perm[cube[2]+1]]].dot(x,   y,   z-1);
    hash_table[2] = gradP[cube[0]+  perm[cube[1]+1+perm[cube[2]  ]]].dot(x,   y-1,   z);
    hash_table[3] = gradP[cube[0]+  perm[cube[1]+1+perm[cube[2]+1]]].dot(x,   y-1, z-1);
    hash_table[4] = gradP[cube[0]+1+perm[cube[1]+  perm[cube[2]  ]]].dot(x-1, y,     z);
    hash_table[5] = gradP[cube[0]+1+perm[cube[1]+  perm[cube[2]+1]]].dot(x-1, y,   z-1);
    hash_table[6] = gradP[cube[0]+1+perm[cube[1]+1+perm[cube[2]  ]]].dot(x-1, y-1,   z);
    hash_table[7] = gradP[cube[0]+1+perm[cube[1]+1+perm[cube[2]+1]]].dot(x-1, y-1, z-1);

    // Interpolate the 8 hash values
    const res = lerp(
        lerp(
          lerp(hash_table[0], hash_table[4], fade_curves[0]),
          lerp(hash_table[1], hash_table[5], fade_curves[0]), fade_curves[2]),
        lerp(
          lerp(hash_table[2], hash_table[6], fade_curves[0]),
          lerp(hash_table[3], hash_table[7], fade_curves[0]), fade_curves[2]),
        fade_curves[1]);
    return res;    
}

