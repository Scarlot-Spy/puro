import React from 'react';
import Discord from 'discord.js'
const guilds = []

const CheckLogin = () => {
    if (!global.user) {
        return <script>window.location.href='/login'</script>
    } else {
        return <a href="/dashboard" class="btn btn-success">Dashboard</a>
    }
}
const redirect = () => {
    if (!global.user) {
        return <script>window.location.href='/login'</script>
    }
}
const checkPerms = (guild) => {
    const permsOnGuild = new Discord.Permissions(guild.permissions_new);
    if (!permsOnGuild.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return;
}
const inviteOrmanage = (id) => {
    if (global.client.guilds.cache.get(id)) {
        return <a href="/dashboard/{id}" class="btn btn-primary">Manage</a>
    } else {
        return <a href="https://discord.com/oauth2/authorize?client_id=983415009021399090&permissions=1237890493686&scope=bot%20applications.commands&guild_id={id}" class="btn btn-primary">Invite</a>
    }
}
const all = () => {
    if (!global.user.guilds) return <>
        <script>
            window.location.href="/login"
        </script>
    </>
    global.user.guilds.map(guild => {
        if (global.client.guilds.cache.get(guild.id)) {
            guilds.push(guild)
        } else {
            guilds.push({name: "Not found!", id: "0"})
        }
    })

    guilds.map(guild => {
        if (!guild) return <>
            <script>
                window.location.href="/login"
            </script>
        </>
        if (guild) return <>
            <div class="card" style={{ width: "18rem" }}>
                <div class="card-body">
                    <h5 class="card-title">{guild.name}</h5>
                    {inviteOrmanage(guild.id)}
                </div>
            </div>
        </>
    })
}
class App extends React.Component {
    render() {
        return <>
            {redirect()}
            <title>{global.config.botInfo.Name} | Dashboard</title>
            <body style={{ backgroundColor: '#4e5d94' }}>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous"></link>
                <link rel="stylesheet" href="/css/home.css"></link>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script>

                <nav class="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2c2f33' }}>
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">{global.config.botInfo.Name}</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                                </li>
                            </ul>
                        </div>
                        {CheckLogin()}

                    </div>
                </nav>
                {all()}
            </body>
        </>;
    }
}

export default App;