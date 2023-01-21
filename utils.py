def safe_wrap(on_error_fn=lambda: None):
    def inner(func):
        def wrap(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                return on_error_fn()
        return wrap 
    return inner