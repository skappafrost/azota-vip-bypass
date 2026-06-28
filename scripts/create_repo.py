import os, json, urllib.request

# Read token from ~/.env
token = ''
env_path = os.path.expanduser('~/.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if line.startswith('GITHUB_TOKEN='):
                token = line.strip().split('=', 1)[1]
                break

if not token:
    print("ERROR: no GITHUB_TOKEN found")
    exit(1)

print(f"Token found: {token[:4]}...")

# 1. Create repo
data = json.dumps({
    'name': 'azota-vip-bypass',
    'description': '⚠️ Tampermonkey script for educational security research on Azota.vn API interception techniques',
    'private': False,
    'has_issues': True,
    'has_wiki': False,
}).encode()

req = urllib.request.Request(
    'https://api.github.com/user/repos',
    data=data,
    headers={
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    }
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    print(f"✅ Repo created: {result.get('full_name')}")
    print(f"   URL: {result.get('html_url')}")
    print(f"   Private: {result.get('private')}")
    node_id = result.get('node_id', '')
except urllib.error.HTTPError as e:
    if e.code == 422:
        print("Repo may already exist, trying to verify...")
        req2 = urllib.request.Request(
            'https://api.github.com/repos/skappafrost/azota-vip-bypass',
            headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}
        )
        resp2 = urllib.request.urlopen(req2)
        result = json.loads(resp2.read())
        print(f"✅ Repo exists: {result.get('full_name')}")
        print(f"   URL: {result.get('html_url')}")
        print(f"   Private: {result.get('private')}")
        node_id = result.get('node_id', '')
    else:
        print(f"ERROR: {e.code} {e.reason}")
        print(e.read().decode()[:300])
        exit(1)

# 2. Try to pin via GraphQL (this may not work for non-org tokens)
print("\nAttempting to pin to profile...")
pin_query = {
    'query': '''
    mutation {
        addProfilePin(input: {repositoryId: "''' + node_id + '''"}) {
            clientMutationId
        }
    }
    '''
}
req3 = urllib.request.Request(
    'https://api.github.com/graphql',
    data=json.dumps(pin_query).encode(),
    headers={
        'Authorization': f'bearer {token}',
        'Content-Type': 'application/json',
    }
)
try:
    resp3 = urllib.request.urlopen(req3)
    pin_result = json.loads(resp3.read())
    print(f"Pin result: {pin_result}")
except urllib.error.HTTPError as e:
    print(f"Pin failed (expected for user tokens): {e.code}")
    body = e.read().decode()[:200]
    print(body)
    print("Manual pin: github.com/skappafrost → Customize pins → azota-vip-bypass")
