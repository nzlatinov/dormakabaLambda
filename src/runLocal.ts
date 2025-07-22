import { handler } from "./index";


const main = async () => {
    const res = await handler({
        queryStringParameters: {
            bucket: 'dormakaba-test-nikola',
            key: 'cert.pem'
        }
    } as any)

    console.log(res);

}


main()