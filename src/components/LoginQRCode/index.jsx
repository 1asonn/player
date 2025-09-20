import React from 'react'
import QRCode from 'react-qr-code'

const LoginQRCode = () => {
    return (
        <div>
            <QRCode value="https://www.baidu.com" />
        </div>
    )
}

export default LoginQRCode