// Implementation of Perlin noise alg from Ken Perlin's
// "Improved Noise reference implementation"
// with Fractal Brownian Motion
// https://cs.nyu.edu/~perlin/noise/


// Fade function
function fade(t: number): number{
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// Linear interpolation
function lerp(t: number, a: number, b: number): number{
    return a + t * (b - a);
}

// Gradient function
function grad(hash: number, x: number, y: number, z: number): number{
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

// Perlin noise function
export function noise(x: number, y: number, z:number): number{

    // Find the unit cube that contains the point
    let cube: [number, number, number];
    cube = [Math.floor(x) & 255, Math.floor(y) & 255, Math.floor(z) & 255];
    
    // Find relative x, y, z of point in cube
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    // Compute fade curves for each of x, y, z
    let fade_curves: [number, number, number];
    fade_curves = [fade(x), fade(y), fade(z)];

    // Generate array of permutations and shuffle it
    const permutation = [];

    for(let i = 0; i < 256; i++) {
        permutation[i] = i;
    }

    permutation.sort(() => Math.random() - 0.5);

    // Copy content of permutation array and append it to itself
    permutation.push(...permutation);


    // Create hash table of cube corners
    // Probably bad idea to use tuple because of poor readability
    let hash_table: [number, number, number, number, number, number];

    hash_table = [0, 0, 0, 0, 0, 0];

    hash_table[0] = permutation[cube[0]] + cube[1];
    hash_table[1] = permutation[hash_table[0]] + cube[2];
    hash_table[2] = permutation[hash_table[0] + 1] + cube[2];
    hash_table[3] = permutation[cube[0] + 1] + cube[1];
    hash_table[4] = permutation[hash_table[3]] + cube[2];
    hash_table[5] = permutation[hash_table[3] + 1] + cube[2];
    

    // This giant chunk of something blends the results of 8 corners of the cube
    // Don't quite understand it, it's copied from Ken Perlin's implementation
    const res = lerp(fade_curves[2], lerp(fade_curves[1], lerp(fade_curves[0], 
        grad(permutation[hash_table[1]], x, y, z), grad(permutation[hash_table[4]], 
            x - 1, y, z)),
            lerp(fade_curves[0], grad(permutation[hash_table[2]], x, y - 1, z),
            grad(permutation[hash_table[5]], x - 1, y - 1, z))),
            lerp(fade_curves[1], lerp(fade_curves[0], grad(permutation[hash_table[1] + 1], x, y, z - 1),
            grad(permutation[hash_table[4] + 1], x - 1, y, z - 1)),
            lerp(fade_curves[0], grad(permutation[hash_table[2] + 1], x, y - 1, z - 1),
            grad(permutation[hash_table[5] + 1], x - 1, y - 1, z - 1))));

    return res;    
}

