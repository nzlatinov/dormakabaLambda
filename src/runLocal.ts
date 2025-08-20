import { handler } from ".";

const main = async () => {
    const res = await handler({
        queryStringParameters: {
            bucket: 'dormakaba-test-nikola',
            key: 'cert.pem'
        }
    })

    console.error(res);

}

main()