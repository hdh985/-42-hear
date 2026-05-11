# In-memory version counters for HTTP response deduplication.
# Incremented on every write; clients compare X-Data-Version header to skip
# unnecessary React state updates when polling returns unchanged data.
# Resets on server restart — acceptable since admin pages refetch on load.

_order_ver: int = 0
_waiting_ver: int = 0


def bump_orders() -> None:
    global _order_ver
    _order_ver += 1


def order_ver() -> int:
    return _order_ver


def bump_waiting() -> None:
    global _waiting_ver
    _waiting_ver += 1


def waiting_ver() -> int:
    return _waiting_ver
