import {Router} from 'express';
import {PostsController} from '../controllers/postsController';

export class PostsRoutes {
  router: Router;
  public postsController: PostsController = new PostsController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get('/', this.postsController.getPosts);
    this.router.get('/lost', this.postsController.getUsersLostPosts);
    this.router.post('/', this.postsController.createPost);
    this.router.delete('/:id', this.postsController.deletePost);
  }
}
