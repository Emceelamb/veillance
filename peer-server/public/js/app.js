/*j// Chat platform
const chatTemplate = Handlebars.compile($('#chat-template').html());
const chatContentTemplate = Handlebars.compile($('#chat-content-template').html());
const chatEl = $('#chat');
const formEl = $('.form');
const messages = [];
let username;

// Local Video
const localImageEl = $('#local-image');
const localVideoEl = $('#local-video');

// Remote Videos
const remoteVideoTemplate = Handlebars.compile($('#remote-video-template').html());
const remoteVideosEl = $('#remote-videos');
let remoteVideosCount = 0;

// Add validation rules to Create/Join Room Form
formEl.form({
  fields: {
    roomName: 'empty',
    username: 'empty',
  },
});
*/
/*
*/



window.addEventListener('load', () => {
    // client code goes here
    
    const chatTemplate = Handlebars.compile($('#chat-template').html());
    const chatContentTemplate = Handlebars.compile($('#chat-content-template').html());

    const chatEl = $('#chat');
    const formEl = $('.form');

    const messages = [];
    let usernmae;

    const localImageEl = $('#local-image');
    const localVideoEl = $('#local-video');

    const remoteVideoTemplate = Handlebars.compile($('#remote-video-template').html());

    const remoteVideosEl = $('#remote-videos');
    let remoteVideosCount = 0;

    formEl.form({
        fields: {
            roomName: 'empty',
            username: 'empty',
        },
    });

    const webrtc = new SimpleWebRTC({
        localVideoEl: 'local-video',
        remoteVideosEl: 'remote-videos',
        autoRequestMedia: true,
    });

    webrtc.on('localStream', ()=>{
        localImageEl.hide();
        localVideoEl.show();
    });
});
