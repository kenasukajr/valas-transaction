const os = require('os');

function detectLocalIP() {
    const interfaces = os.networkInterfaces();
    
    // Priority: 192.168.x.x subnet
    for (const interfaceName of Object.keys(interfaces)) {
        const interface_info = interfaces[interfaceName];
        if (!interface_info) continue;
        
        for (const info of interface_info) {
            if (info.family !== 'IPv4' || info.internal) continue;
            if (info.address.startsWith('192.168.')) {
                return info.address;
            }
        }
    }
    
    // Fallback: other private IPs
    for (const interfaceName of Object.keys(interfaces)) {
        const interface_info = interfaces[interfaceName];
        if (!interface_info) continue;
        
        for (const info of interface_info) {
            if (info.family !== 'IPv4' || info.internal) continue;
            if (info.address.startsWith('10.') || 
                (info.address.startsWith('172.') && 
                 parseInt(info.address.split('.')[1]) >= 16 && 
                 parseInt(info.address.split('.')[1]) <= 31)) {
                return info.address;
            }
        }
    }
    
    return 'localhost';
}

console.log('=== AUTO IP DETECTION TEST ===');
console.log('Detected IP:', detectLocalIP());
console.log('Frontend URL (Local):', `http://localhost:8000`);
console.log('Frontend URL (Network):', `http://${detectLocalIP()}:8000`);
console.log('Backend URL:', `http://${detectLocalIP()}:5000`);

// Test semua network interfaces
console.log('\n=== ALL NETWORK INTERFACES ===');
const interfaces = os.networkInterfaces();
for (const interfaceName of Object.keys(interfaces)) {
    const interface_info = interfaces[interfaceName];
    if (!interface_info) continue;
    
    console.log(`\n${interfaceName}:`);
    for (const info of interface_info) {
        if (info.family === 'IPv4') {
            console.log(`  ${info.address} (${info.internal ? 'Internal' : 'External'})`);
        }
    }
}
