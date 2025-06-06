// components/UploadWidget.js
import { useEffect } from 'react';

const UploadWidget = ({ onUpload }) => {
    useEffect(() => {
        if (!window.cloudinary) {
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            script.onload = () => console.log('Cloudinary script loaded');
            document.body.appendChild(script);
        }
    }, []);

    const openWidget = () => {
        if (window.cloudinary) {
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloudName: 'drwu3wsli',
                    uploadPreset: 'delegates',
                    sources: ['local', 'camera'],
                    multiple: false

                },
                (error, result) => {
                    if (!error && result.event === 'success') {
                        console.log('Upload success:', result.info);
                        onUpload(result.info); // send image info to parent
                    }
                }
            );
            widget.open();
        }
    };

    return (
        <button type="button" onClick={openWidget}>
            Upload Image
        </button>
    );
};

export default UploadWidget;
