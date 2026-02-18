const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''
});

cloudinary.api.resources({ 
    type: 'upload',
    prefix: 'bm2mall/' 
}, function(error, result) {
    if (error) {
        console.error(error);
        return;
    }
    console.log('--- BM2MALL ASSETS ---');
    result.resources.forEach(r => console.log(r.public_id + ' (' + r.format + ')'));
    console.log('Total in bm2mall: ' + result.resources.length);
});
