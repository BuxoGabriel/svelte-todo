<style>
    nav {
        width: 100vw;
        height: 10vh;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #aa5555
    }
    .logo, .logout {
        border-radius: 8px;
        padding: 1rem 2rem;
        margin: 0 1rem;
    }
    
    .logo {
        font-size: 2rem;
    }
</style>

<nav>
    <div class="logo">Todo App</div>
    <form action="/logout" method="DELETE">
        <button class="logout" type="submit">Log Out</button>
</nav>

<slot />
