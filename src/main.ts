import { SkyWayAuthToken } from '@skyway-sdk/token';

declare var global: any;

global.doGet = (e: GoogleAppsScript.Events.DoGet) => {
    const res = ContentService.createTextOutput();
    res.setMimeType(ContentService.MimeType.JSON);
    const roomName = e.parameter.roomName || '*';
    const memberName = e.parameter.memberName || '*';

    const ps = PropertiesService.getScriptProperties();
    const appId = ps.getProperty('SKYWAY_APP_ID');
    const secretKey = ps.getProperty('SKYWAY_SECRET_KEY');

    if (appId === null || secretKey === null || appId === undefined || secretKey === undefined || appId === '' || secretKey === '') {
        res.setContent(JSON.stringify({ error: 'appId or secretKey is empty.' }));
        return res;
    }

    const token = new SkyWayAuthToken({
        jti: Utilities.getUuid(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        scope: {
            app: {
                id: appId,
                turn: true,
                actions: ['read'],
                channels: [
                    {
                        id: '*',
                        name: roomName,
                        actions: ['write'],
                        members: [
                            {
                                id: '*',
                                name: memberName,
                                actions: ['write'],
                                publication: {
                                    actions: ['write'],
                                },
                                subscription: {
                                    actions: ['write'],
                                },
                            },
                        ],
                        sfuBots: [
                            {
                                actions: ['write'],
                                forwardings: [
                                    {
                                        actions: ['write']
                                    }
                                ]
                            }
                        ]
                    },
                ],
            },
        },
    });
    const tokenString = token.encode(secretKey);

    const obj = {
        token: tokenString
    };
    res.setContent(JSON.stringify(obj));
    return res;
};
