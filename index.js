// require the discord.js module
const Discord = require('discord.js');
var jsdom = require('jsdom');
var $ = require('jquery');
$ = require('jquery')(new jsdom.JSDOM().window);



var prefix = "!";


// create a new Discord client
const client = new Discord.Client();

function makeChannel(cmd, msg) {
    var server = msg.guild;
    var name = cmd;
    var role = msg.guild.roles.find(r => r.name === `${cmd}`)

    server.createChannel(name, {
        type: "text",
            permissionOverwrites: [
        {
            id: msg.guild.defaultRole.id,
            deny: ['VIEW_CHANNEL'],
        },
    ],
    })
        .then(channel => {
            let category = server.channels.find(c => c.name == "Events" && c.type == "category");

            if (!category) throw new Error("Category channel does not exist");
            channel.setParent(category.id);
        }).catch(console.error);
}

function assignRole(role, targetMember, msg) {
    let assignedRole = msg.guild.roles.find(r => r.name === `${role}`);
    let assignedUser = client.users.find(user => user.username == `${targetMember}`);
    var assignedMember = msg.guild.member(assignedUser);
    assignedMember.addRole(assignedRole);
    msg.channel.send(`Role: ${assignedRole} Member: ${assignedMember}`);
}

function createRole(name, msg) {
    msg.guild.createRole({ name: `${name}`, hoist: true, mentionable: false });
}

function createEvent(msg, filter, name, invited) {

    invitedarr = [];
    for (let step = 0; step < invited.length; step++) {
        // Runs 5 times, with values of step 0 through 4.
        currentinvited = invited[step];
        let parsedinvited = client.users.find(user => user.username == `${currentinvited}`);
        invitedarr.push(`${parsedinvited}`)
    }
    msg.channel.send(invitedarr);

    const embed = new Discord.RichEmbed()
        .setTitle('Available Options')
        .setDescription(`
                    Is anyone interested in
                    **${name}**? If so, respond with ✅
                `)
        .setColor(0xdd9323)
        .setFooter(`ID: ${msg.author.id}`);

    makeChannel(name, msg); 

    msg.channel.send(embed).then(async msg => {

        await msg.react('✅');
        await msg.react('❌');
        // creates a collector that when a user reacts to the event the line(s) following col.on will run
        let col = msg.createReactionCollector(filter);
        col.on('collect', r => {
            switch (r.emoji.name) {
                case '✅':
                    msg.channel.send(`**${r.users.last().username}** is attending the event! ${r.emoji}`);
                    const yourchannel = msg.guild.channels.find(channel => channel.name === name)
                    yourchannel.overwritePermissions(r.users.last(), { VIEW_CHANNEL: true });
                    break;
                case '❌':
                    msg.channel.send(`**${r.users.last().username}** is not attending the event 😟`);
                    break;
            }
            
        });
        
    });
}



// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', msg => {
    // sets to which emoji's any collector will run given this parameter
    const filter = (reaction, user) => {
        return reaction.emoji.name === '✅' || reaction.emoji.name === '❌';
    };

    if (msg.content.startsWith(`${prefix}createevent`)) {
        var args = msg.content.split(' ');
        var name = args[1];
        var invited = [""];
        var invited = args[2];
        var invitedarr = invited.split(',');
        //console.log(invitedarr);
        createEvent(msg, filter, name, invitedarr);
    }

    if (msg.content === 'ping') {
        msg.channel.send(embed)
        msg.reply('Pong!');
        msg.react('✅');
        msg.channel.send(msg.guild.roles.find(r => r.name === `A`));
    }
    if (msg.content.startsWith(`${prefix}createchannel`) && msg.author != "<@669786773915959345>") {
        var args = msg.content.split(' ');
        var cmd = args[1];
        if (cmd) {
            makeChannel(cmd, msg);
            console.log(`User: ${msg.author}`);
        } else {
            msg.channel.send('!createchannel [channel name]');
        }
    }
    if (msg.content.startsWith(`${prefix}assignrole`) && msg.author != "<@669786773915959345>") {
        var args = msg.content.split(' ');
        var role = args[1];
        var member = args[2];
        if (role && member) {
            assignRole(role, member, msg);
        } else {
            msg.channel.send(`!assignrole [role name] [username]`);
        }
        
    }
    if (msg.content.startsWith(`${prefix}createrole`) && msg.author != "<@669786773915959345>") {
        var args = msg.content.split(' ');
        var cmd = args[1];
        if (cmd) {
            createRole(cmd ,msg);
        } else {
            msg.channel.send('!createrole [role name]')
        }
    }
});

// login to Discord with your app's token
client.login('NjY5Nzg2NzczOTE1OTU5MzQ1.XmTu5w.qlEQLZzLcPBL_XfDax-Tw25Yl84');