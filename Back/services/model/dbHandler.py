def createUserTableDB(db,user):
    db.create_all()
    db.session.query(user).delete()
    db.session.commit()

def addUserDB(db,user,name,email):
    new_row = user(name=name, email=email)
    db.session.add(new_row)
    db.session.commit()

def deleteUserDB(db,user,userId):
    item_to_delete = user.query.get(userId)
    if item_to_delete:
        db.session.delete(item_to_delete)
        db.session.commit()

def getUserDB(db,user):
    # Query all items from the Item table
    users = user.query.all()
    return users