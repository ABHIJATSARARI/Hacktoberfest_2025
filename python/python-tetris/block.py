import constants
import pygame
import math
import copy

class Block(object):
    """
    Class for handling of tetris block
    """    

    def __init__(self,shape,x,y,screen,color,rotate_en):
        self.shape = []
        for sh in shape:
            bx = sh[0]*constants.BWIDTH + x
            by = sh[1]*constants.BHEIGHT + y
            block = pygame.Rect(bx,by,constants.BWIDTH,constants.BHEIGHT)
            self.shape.append(block)     
        self.rotate_en = rotate_en
        self.x = x
        self.y = y
        self.diffx = 0
        self.diffy = 0
        self.screen = screen
        self.color = color
        self.diff_rotation = 0

    def draw(self):
        for bl in self.shape:
            pygame.draw.rect(self.screen,self.color,bl)
            pygame.draw.rect(self.screen,constants.BLACK,bl,constants.MESH_WIDTH)
        
    def get_rotated(self,x,y):
        rads = self.diff_rotation * (math.pi / 180.0)
        newx = x*math.cos(rads) - y*math.sin(rads)
        newy = y*math.cos(rads) + x*math.sin(rads)
        return (newx,newy)        

    def move(self,x,y):
        self.diffx += x
        self.diffy += y  
        self._update()

    def remove_blocks(self,y):
        new_shape = []
        for shape_i in range(len(self.shape)):
            tmp_shape = self.shape[shape_i]
            if tmp_shape.y < y:
                new_shape.append(tmp_shape)  
                tmp_shape.move_ip(0,constants.BHEIGHT)
            elif tmp_shape.y > y:
                new_shape.append(tmp_shape)
        self.shape = new_shape

    def has_blocks(self):
        return True if len(self.shape) > 0 else False

    def rotate(self):
        if self.rotate_en:
            self.diff_rotation = 90
            self._update()

    def _update(self):
        for bl in self.shape:
            origX = (bl.x - self.x)/constants.BWIDTH
            origY = (bl.y - self.y)/constants.BHEIGHT
            rx,ry = self.get_rotated(origX,origY)
            newX = rx*constants.BWIDTH  + self.x + self.diffx
            newY = ry*constants.BHEIGHT + self.y + self.diffy
            newPosX = newX - bl.x
            newPosY = newY - bl.y
            bl.move_ip(newPosX,newPosY)
        self.x += self.diffx
        self.y += self.diffy
        self.diffx = 0
        self.diffy = 0
        self.diff_rotation = 0

    def backup(self):
        self.shape_copy = copy.deepcopy(self.shape)
        self.x_copy = self.x
        self.y_copy = self.y
        self.rotation_copy = self.diff_rotation     

    def restore(self):
        self.shape = self.shape_copy
        self.x = self.x_copy
        self.y = self.y_copy
        self.diff_rotation = self.rotation_copy

    def check_collision(self,rect_list):
        for blk in rect_list:
            collist = blk.collidelistall(self.shape)
            if len(collist):
                return True
        return False