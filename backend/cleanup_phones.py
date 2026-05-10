from apps.accounts.models import User
seen = set()
for u in User.objects.all():
    if u.phone in seen and u.phone:
        u.phone = f"{u.phone}_{u.id}"
        u.save()
        print(f"Updated duplicate phone for {u.username} to {u.phone}")
    else:
        if u.phone:
            seen.add(u.phone)
