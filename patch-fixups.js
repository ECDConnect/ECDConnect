const fs = require('fs');
const path = require('path');
const process = require('process');

// Get Node.js version without patch version (e.g., "16.20")
const nodeVersion = process.version.replace('v', '').split('.').slice(0, 2).join('.');

function copyFixups(sourceDir = 'node_modules.fixup', targetDir = 'node_modules') {
    // Find the most appropriate version directory
    const versions = fs.readdirSync(sourceDir)
        .filter(dir => fs.statSync(path.join(sourceDir, dir)).isDirectory())
        .sort((a, b) => {
            // Sort versions in descending order
            const [aMajor, aMinor] = a.split('.').map(Number);
            const [bMajor, bMinor] = b.split('.').map(Number);
            return bMajor - aMajor || bMinor - aMinor;
        });

    // Find the highest version that's less than or equal to current Node version
    const [currentMajor, currentMinor] = nodeVersion.split('.').map(Number);
    const appropriateVersion = versions.find(version => {
        const [major, minor] = version.split('.').map(Number);
        return major < currentMajor || (major === currentMajor && minor <= currentMinor);
    });

    if (!appropriateVersion) {
        console.error(`No appropriate fixup version found for Node ${nodeVersion}`);
        return;
    }

    const fixupDir = path.join(sourceDir, appropriateVersion);

    function copyRecursively(src, dest) {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();

        if (isDirectory) {
            // Create directory if it doesn't exist
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            
            // Copy each file in the directory
            fs.readdirSync(src).forEach(childItemName => {
                copyRecursively(
                    path.join(src, childItemName),
                    path.join(dest, childItemName)
                );
            });
        } else {
            // Copy file
            try {
                fs.copyFileSync(src, dest);
                console.log(`✓ Copied: ${path.relative(process.cwd(), dest)}`);
            } catch (error) {
                console.error(`✗ Failed to copy ${dest}: ${error.message}`);
            }
        }
    }

    console.log(`\nApplying fixups for Node ${appropriateVersion}...`);
    copyRecursively(fixupDir, targetDir);
}

// Add this to your package.json scripts
module.exports = copyFixups;

// If running directly
if (require.main === module) {
    copyFixups();
}