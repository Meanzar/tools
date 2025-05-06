import { User } from "@/models/schema"

export async function getData(url: string) {
    try {
        const req = await fetch(url, {
            'method': 'GET', 'cache': 'no-store', 
            headers:{
                'Content-Type' : 'application/json'
            }
        }
        )
        const json = await req.json()
        return {ok: req.ok, status: req.status, data: json}
    }

    catch(error) {
        console.error(error)
        return { ok: false, status: 500, data: null }
    }
}

export async function postData(url: string, data: unknown) {
    try {
        const req = await fetch(url, {
            'method': 'POST', 'cache': 'no-store', 
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await req.json()
        return {ok: req.ok, status: req.status, data: json}
    }

    catch(error) {
        console.error(error)
        return { ok: false, status: 500, data: null }
    }
}

export async function putData(url: string, data: unknown ) {
    try {
        const req = await fetch(url, {
            'method': 'PUT', 'cache': 'no-store', 
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await req.json()
        return {ok: req.ok, status: req.status, data: json}
    }

    catch(error) {
        console.error(error)
        return { ok: false, status: 500, data: null }
    }
}

export async function deleteData(url: string, data: string) {
    try {
        const req = await fetch(url, {
            'method': 'DELETE', 'cache': 'no-store', 
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await req.json()
        return {ok: req.ok, status: req.status, data: json}
    }

    catch(error) {
        console.error(error)
        return { ok: false, status: 500, data: null }
    }
}


export async function handleUser(url: string, data: User) {
    try {
        const req = await fetch(url, {
            "method": 'POST', 'cache': 'no-store',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await req.json()
        return { ok: req.ok, status: req.status, data: json } 
    } catch (error) {
        console.error(error)
        return { ok: false, status: 500, data: null }
    }

}