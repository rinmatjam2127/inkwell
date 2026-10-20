import { jest } from "@jest/globals";

// Mock Repositories and EventBus
const mockPostRepository = {
  createWithTags: jest.fn(),
  findPublished: jest.fn(),
  searchPublished: jest.fn(),
};

const mockEventBus = {
  emit: jest.fn(),
};

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PostService.publish", () => {
  test("publish() creates a PUBLISHED post and emits post.published", async () => {
    mockPostRepository.createWithTags.mockResolvedValue({
      id: "p1",
      title: "Hello",
      status: "PUBLISHED",
    });

    const post = await PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "World",
    });

    expect(post.status).toBe("PUBLISHED");
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      "post.published",
      expect.objectContaining({ postId: "p1" })
    );
  });

  test("publish() rejects an empty title", async () => {
    await expect(
      PostService.publish({ authorId: "u1", title: "", body: "World" })
    ).rejects.toThrow();
  });
});

describe("PostService.search", () => {
  test("returns matching posts for a valid query (row 1, black-box equivalence)", async () => {
    const mockData = {
      posts: [{ id: "p1", title: "On Modularity", body: "Cohesion thoughts" }],
      hasMore: false,
    };
    mockPostRepository.searchPublished.mockResolvedValue(mockData);

    const result = await PostService.search({
      query: "modularity",
      page: 1,
      pageSize: 10,
    });

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toBe("On Modularity");
    expect(result.hasMore).toBe(false);
    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "modularity",
      page: 1,
      pageSize: 10,
    });
  });

  test("returns empty posts array when no posts match (row 2, black-box equivalence)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    const result = await PostService.search({
      query: "nonexistent",
      page: 1,
      pageSize: 10,
    });

    expect(result.posts).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  test("uses default pagination parameters when page/pageSize are omitted (row 3, black-box boundary)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await PostService.search({ query: "design" });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "design",
      page: 1,
      pageSize: 10,
    });
  });

  test("propagates underlying repository errors (row 4, white-box branch)", async () => {
    mockPostRepository.searchPublished.mockRejectedValue(
      new Error("Database connection failed")
    );

    await expect(
      PostService.search({ query: "architecture" })
    ).rejects.toThrow("Database connection failed");
  });
});