export async function sendMail(toAddress: string, subject: string, body: string) {
    const send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: toAddress, name: 'Packageup User' }],
                },
            ],
            from: {
                email: 'help@packageup.io',
                name: 'PackageUp',
            },
            subject,
            content: [
                {
                    type: 'text/html',
                    value: body,
                },
            ],
        })
    });
    const resp = await fetch(send_request);
    return await resp.text();
}