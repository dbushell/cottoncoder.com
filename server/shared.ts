export const redirect = (location: string | URL, status = 302) => {
  location = location instanceof URL ? location.href : location;
  return new Response(null, {
    status,
    headers: {
      location
    }
  });
};

export const authorized = (request: Request) => {
  if (
    request.method === 'GET' &&
    request.headers.get('authorization') ===
      `Bearer ${Deno.env.get('CC_API_KEY')}`
  ) {
    return true;
  }
};
