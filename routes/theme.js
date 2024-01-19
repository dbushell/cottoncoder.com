export const pattern = '/';

const themes = ['light', 'dark'];

export const post = async (request, _res, {platform}) => {
  try {
    const data = await request.json();
    if (!themes.includes(data.theme)) {
      throw new Error();
    }
    platform.cookies.set('theme', {
      value: data.theme,
      path: '/',
      maxAge: 2630000,
      sameSite: 'Strict',
      secure: true
    });
    return Response.json({success: true});
  } catch {
    return new Response(null, {status: 400});
  }
};
