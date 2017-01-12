"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const API_BASE_URI = 'https://petstore-popeye.elastic.io/v2';

exports.process = processAction;

/**
 * Executes the action's logic by sending a request to the Petstore API and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as apiKey and pet status
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {

    // access the value of the apiKey field defined in credentials section of component.json
    const apiKey = cfg.apiKey;

    // access the value of the mapped value into name field of the in-metadata
    const name = cfg.name;
    // access the value of the mapped value into name field of the in-metadata
    const status = cfg.status;

    if (!name) {
        throw new Error('Name is required');
    }

    if (!status) {
        throw new Error('Status is required');
    }

    const pet = {
        name,
        status
    };

    console.log('About to create new pet');

    const requestOptions = {
        uri: `${API_BASE_URI}/pet`,
        headers: {
            'api-key': apiKey
        },
        json: true
    };

    // return the promise that sends a request to the Petstore API
    return request.post(requestOptions)
        .then((response) => messages.newMessageWithBody(response));
}