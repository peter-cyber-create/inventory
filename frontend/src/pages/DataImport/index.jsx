import React from 'react'

const DataImport = () => {
    return (
        <div>
            <h5 class="font-size-14 mb-3">Upload File To server</h5>
            <div class="dropzone dz-clickable">
                <div class="dz-message needsclick">
                    <div class="mb-3">
                        <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                    </div>
                    <h4>Drop files here or click to upload.</h4>
                </div>
            </div>
            <ul class="list-unstyled mb-0" id="dropzone-preview">
            </ul>
        </div>
    )
}

export default DataImport